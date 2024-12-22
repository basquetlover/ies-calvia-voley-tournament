// import { lucia } from "./auth";
// import { defineMiddleware } from "astro:middleware";

// export const onRequest = defineMiddleware(async (context, next) => {
// 	const sessionId = context.cookies.get(lucia.sessionCookieName)?.value ?? null;
// 	if (!sessionId) {
// 		context.locals.user = null;
// 		context.locals.session = null;
// 		return next();
// 	}

// 	const { session, user } = await lucia.validateSession(sessionId);
// 	if (session && session.fresh) {
// 		const sessionCookie = lucia.createSessionCookie(session.id);
// 		context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
// 	}
// 	if (!session) {
// 		const sessionCookie = lucia.createBlankSessionCookie();
// 		context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
// 	}
// 	context.locals.session = session;
// 	context.locals.user = user;
// 	return next();
// });

import type { MiddlewareHandler } from 'astro';
import { createClient } from '@supabase/supabase-js';
import config from './config';


export const onRequest: MiddlewareHandler = async ({ locals, cookies }, next) => {
  try {
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
		console.error('Middleware - Missing Supabase environment variables');
		return next();
	  }

    const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

    const accessToken = cookies.get('sb-access-token')?.value ?? null;
    const refreshToken = cookies.get('sb-refresh-token')?.value ?? null;

    if (!accessToken || !refreshToken) {
      locals.StaffUser = null;
      locals.session = null;
      return next();
    }

    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    if (error) {
      console.error('Error setting Supabase session:', error);
      locals.StaffUser = null;
      locals.session = null;
      cookies.delete('sb-access-token', { path: '/' });
      cookies.delete('sb-refresh-token', { path: '/' });
    } else if (data.session) {
      locals.StaffUser = {
        id: data.user?.id ?? '',
        email: data.user?.email ?? ''
      };
      locals.session = {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
      };

      // Update cookies with new tokens if they've changed
      if (data.session.access_token !== accessToken) {
        cookies.set('sb-access-token', data.session.access_token, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7 // 1 week
        });
      }
      if (data.session.refresh_token !== refreshToken) {
        cookies.set('sb-refresh-token', data.session.refresh_token, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7 // 1 week
        });
      }
    } else {
      locals.StaffUser = null;
      locals.session = null;
      cookies.delete('sb-access-token', { path: '/' });
      cookies.delete('sb-refresh-token', { path: '/' });
    }
  } catch (error) {
    console.error('Middleware - Error:', error);
    locals.StaffUser = null;
    locals.session = null;
    cookies.delete('sb-access-token', { path: '/' });
    cookies.delete('sb-refresh-token', { path: '/' });
  }

  return next();
};

// import type { MiddlewareHandler } from 'astro';
// import { createClient } from '@supabase/supabase-js';

// // Inicializa el cliente de Supabase
// const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables');
// }

// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// export const onRequest: MiddlewareHandler = async ({ locals, cookies }, next) => {
//   try {
//     const accessToken = cookies.get('sb-access-token');
//     const refreshToken = cookies.get('sb-refresh-token');

//     if (accessToken && refreshToken) {
//       const { data, error } = await supabase.auth.setSession({
//         refresh_token: refreshToken.value,
//         access_token: accessToken.value,
//       });

//       if (error) {
//         console.error('Error setting session:', error);
//         cookies.delete('sb-access-token', { path: '/' });
//         cookies.delete('sb-refresh-token', { path: '/' });
//       } else if (data.user) {
//         locals.user = {
//           id: data.user.id,
//           email: data.user.email,
//         };
//       } else {
//         locals.user = null;
//       }
//     } else {
//       locals.user = null;
//     }

//     return next();
//   } catch (e) {
//     console.error('Middleware error:', e);
//     throw e;
//   }
// };

