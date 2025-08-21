import { useEffect } from 'react';

declare global {
  interface Window {
    google: any;
    handleCredentialResponse?: (response: any) => void;
  }
}

const CLIENT_ID = import.meta.env.CLIENT_ID_OAUTH;

const allowedEmailsOrDomains = [
  "a.iescalvia.com",
  "iescalvia.com",
  "alemanytomaspere@gmail.com",
];

export default function SignInGoogle() {
  const handleCredentialResponse = (response: any) => {
    const jwt = response.credential;
     const payload = JSON.parse(atob(jwt.split('.')[1]));
    // const { name, email } = payload;
    const { email } = payload;

    const isAllowed = allowedEmailsOrDomains.some((allowed) => {
      if (allowed.includes('@')) {
        // Es un email exacto
        return email === allowed;
      } else {
        // Es dominio, comprobamos que email termine en @dominio
        return email.endsWith(`@${allowed}`);
      }
    });

    if (!isAllowed) {
      alert('Cuenta no permitida. Usa un correo válido.');
      return;
    }

    // console.log('Usuario:', jwt);
    const redireccion = `/registrarse?credential="${jwt}"`;
    window.location.href = redireccion;
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client?hl=ca';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    window.handleCredentialResponse = handleCredentialResponse;

    return () => {
      document.body.removeChild(script);
      delete window.handleCredentialResponse;
    };
  }, []);

  return (
    <>
      <div
        id="g_id_onload"
        data-client_id={CLIENT_ID}
        data-callback="handleCredentialResponse"
        data-auto_prompt="false"
        
      ></div>

      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="pill"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
    </>
  );
}