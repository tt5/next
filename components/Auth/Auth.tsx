import React, { useEffect, useRef, useState } from "react";
import { Provider, SupabaseClient } from "@supabase/supabase-js";
import Input from "../Input/Input.tsx";
import Button from "../Button/Button";
//import Typography from '../Typography/Typography.tsx'
import { UserContextProvider, useUser } from "./UserContext.tsx";
import * as SocialIcons from "./Icons.tsx";
import { useRouter } from 'next/router'

const VIEWS: ViewsMap = {
  SIGN_IN: "sign_in",
  SIGN_UP: "sign_up",
  FORGOTTEN_PASSWORD: "forgotten_password",
  MAGIC_LINK: "magic_link",
  UPDATE_PASSWORD: "update_password",
};

interface ViewsMap {
  [key: string]: ViewType;
}

type ViewType =
  | "sign_in"
  | "sign_up"
  | "forgotten_password"
  | "magic_link"
  | "update_password";

type RedirectTo = undefined | string;

export interface Props {
  supabaseClient: SupabaseClient;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  socialLayout?: "horizontal" | "vertical";
  providers?: Provider[];
  verticalSocialLayout?: any;
  view?: ViewType;
  magicLink?: boolean;
}

function Auth({
  supabaseClient,
  socialLayout = "vertical",
  providers,
  view = "sign_in",
  magicLink = true,
}: Props) {
  const [authView, setAuthView] = useState(view);
  const [defaultEmail, setDefaultEmail] = useState("");
  const [defaultPassword, setDefaultPassword] = useState("");

  const verticalSocialLayout = socialLayout === "vertical" ? true : false;

  const Container = ({children}) => (
    <div className="bg-red-200 p-2 border-solid border-4">
        <SocialAuth
          supabaseClient={supabaseClient}
          verticalSocialLayout={verticalSocialLayout}
          providers={providers}
          socialLayout={socialLayout}
          magicLink={magicLink}
        />
        {children}
    </div>
  );

  useEffect(() => {
    // handle view override
    setAuthView(view);
  }, [view]);

  switch (authView) {
    case VIEWS.SIGN_IN:
    case VIEWS.SIGN_UP:
      return (
        <Container>
          <EmailAuth
            id={authView === VIEWS.SIGN_UP ? "auth-sign-up" : "auth-sign-in"}
            supabaseClient={supabaseClient}
            authView={authView}
            setAuthView={setAuthView}
            defaultEmail={defaultEmail}
            defaultPassword={defaultPassword}
            setDefaultEmail={setDefaultEmail}
            setDefaultPassword={setDefaultPassword}
            magicLink={magicLink}
          />
        </Container>
      );
    case VIEWS.FORGOTTEN_PASSWORD:
      return (
        <Container>
          <ForgottenPassword
            supabaseClient={supabaseClient}
            setAuthView={setAuthView}
          />
        </Container>
      );

    case VIEWS.MAGIC_LINK:
      return (
        <Container>
          <MagicLink
            supabaseClient={supabaseClient}
            setAuthView={setAuthView}
          />
        </Container>
      );

    case VIEWS.UPDATE_PASSWORD:
      return (
        <Container>
          <UpdatePassword supabaseClient={supabaseClient} />
        </Container>
      );

    default:
      return null;
  }
}

function SocialAuth({
  className,
  style,
  supabaseClient,
  children,
  socialLayout = "vertical",
  providers,
  verticalSocialLayout,
  magicLink,
  ...props
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleProviderSignIn = async (provider: Provider) => {
    setLoading(true);
    const { error } = await supabaseClient.auth.signIn(
      { provider },
    );
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <>
      {providers && providers.length > 0 && (
        <React.Fragment>
          <div>
            Sign in with
            <div>
              {providers.map((provider) => {
                // @ts-ignore
                const AuthIcon = SocialIcons[provider];
                return (
                  <div key={provider}>
                    <Button
                      type="default"
                      icon={<AuthIcon />}
                      loading={loading}
                      onClick={() => handleProviderSignIn(provider)}
                    >
                      {"Sign up with " + provider}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
          <div>or continue with</div>
        </React.Fragment>
      )}
    </>
  );
}

function EmailAuth({
  authView,
  defaultEmail,
  defaultPassword,
  id,
  setAuthView,
  setDefaultEmail,
  setDefaultPassword,
  supabaseClient,
  magicLink,
}: {
  authView: ViewType;
  defaultEmail: string;
  defaultPassword: string;
  id: "auth-sign-up" | "auth-sign-in";
  setAuthView: any;
  setDefaultEmail: (email: string) => void;
  setDefaultPassword: (password: string) => void;
  supabaseClient: SupabaseClient;
  magicLink?: boolean;
}) {
  const isMounted = useRef<boolean>(true);
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter()

  useEffect(() => {
    setEmail(defaultEmail);
    setPassword(defaultPassword);

    return () => {
      isMounted.current = false;
    };
  }, [authView]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    switch (authView) {
      case "sign_in":
        const { error: signInError } = await supabaseClient.auth.signIn(
          {
            email,
            password,
          }
        );
        if (signInError) setError(signInError.message);
        else router.push('/dashboard')
        break;
      case "sign_up":
        const { error: signUpError, data: signUpData } = await supabaseClient
          .auth.signUp(
            {
              email,
              password,
            }
          );
        if (signUpError) setError(signUpError.message);
        // checking if it has access_token to know if email verification is disabled
        else if (signUpData?.hasOwnProperty("confirmation_sent_at")) {
          setMessage("Check your email for the confirmation link.");
        }
        break;
    }

    /*
     * it is possible the auth component may have been unmounted at this point
     * check if component is mounted before setting a useState
     */
    if (isMounted.current) setLoading(false);
  };

  const handleViewChange = (newView: ViewType) => {
    setDefaultEmail(email);
    setDefaultPassword(password);
    setAuthView(newView);
  };

  return (
    <form id={id} onSubmit={handleSubmit}>
      <div>
        <div>
          <Input
            className=""
            label="Email address"
            autoComplete="email"
            defaultValue={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            defaultValue={password}
            autoComplete="current-password"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)}
          />
        </div>
        <div>
          <div>
            {authView === VIEWS.SIGN_IN ?
            (
              <a
                href="#auth-forgot-password"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault()
                  setAuthView(VIEWS.FORGOTTEN_PASSWORD)
                }}
              >
                Forgot your password?
              </a>
            ) : (
              <div className="text-transparent">
                Forgot your password?
              </div>
            )}
          </div>
          <Button
            htmlType="submit"
            size="large"
            loading={loading}
          >
          <button className="w-20">
            {authView === VIEWS.SIGN_IN ? "Sign in" : "Sign up"}
            </button>
          </Button>
        </div>
        <div>
          {authView === VIEWS.SIGN_IN && magicLink ? (
            <div>
              Sign in with magic link
            </div>
          ) : (
            <div className="text-transparent">
              Sign in with magic link
            </div>
          )}
          {authView === VIEWS.SIGN_IN
            ? (
              <a
                href="#auth-sign-up"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  handleViewChange(VIEWS.SIGN_UP);
                }}
              >
                Don't have an account? Sign up
              </a>
            )
            : (
              <a
                href="#auth-sign-in"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault()
                  handleViewChange(VIEWS.SIGN_IN)
                }}
              >
                Do you have an account? Sign in
              </a>
            )}
          {message && <div>{message}</div>}
          {error && <div>{error}</div>}
        </div>
      </div>
    </form>
  );
}

function MagicLink({
  setAuthView,
  supabaseClient,
}: {
  setAuthView: any;
  supabaseClient: SupabaseClient;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMagicLinkSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const { error } = await supabaseClient.auth.signIn(
      { email },
    );
    if (error) setError(error.message);
    else setMessage("Check your email for the magic link");
    setLoading(false);
  };

  return (
    <form id="auth-magic-link" onSubmit={handleMagicLinkSignIn}>
      <div>
        <div>
          <Input
            label="Email address"
            placeholder="Your email address"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)}
          />
          <Button
            size="large"
            htmlType="submit"
            loading={loading}
          >
            Send magic link
          </Button>
        </div>
        <div>
          Sign in with password
        </div>
        {message && <div>{message}</div>}
        {error && <div>{error}</div>}
      </div>
    </form>
  );
}

function ForgottenPassword({
  setAuthView,
  supabaseClient,
}: {
  setAuthView: any;
  supabaseClient: SupabaseClient;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const { error } = await supabaseClient.auth.api.resetPasswordForEmail(
      email,
    );
    if (error) setError(error.message);
    else setMessage("Check your email for the password reset link");
    setLoading(false);
  };

  return (
    <form id="auth-forgot-password" onSubmit={handlePasswordReset}>
      <div>
        <div>
          <Input
            label="Email address"
            placeholder="Your email address"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)}
          />
          <Button
            size="large"
            htmlType="submit"
            loading={loading}
          >
            Send reset password instructions
          </Button>
        </div>
        <a
          href="#auth-sign-in"
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault()
            setAuthView(VIEWS.SIGN_IN)
          }}
        >
          Go back to sign in
        </a>
        {message && <div>{message}</div>}
        {error && <div>{error}</div>}
      </div>
    </form>
  );
}

function UpdatePassword({
  supabaseClient,
}: {
  supabaseClient: SupabaseClient;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const { error } = await supabaseClient.auth.update({ password });
    if (error) setError(error.message);
    else setMessage("Your password has been updated");
    setLoading(false);
  };

  return (
    <form id="auth-update-password" onSubmit={handlePasswordReset}>
      <div>
        <div>
          <Input
            label="New password"
            placeholder="Enter your new password"
            type="password"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)}
          />
          <Button
            size="large"
            htmlType="submit"
            loading={loading}
          >
            Update password
          </Button>
        </div>
        {message && <div>{message}</div>}
        {error && <div>{error}</div>}
      </div>
    </form>
  );
}

Auth.ForgottenPassword = ForgottenPassword;
Auth.UpdatePassword = UpdatePassword;
Auth.MagicLink = MagicLink;
Auth.UserContextProvider = UserContextProvider;
Auth.useUser = useUser;

export default Auth;
