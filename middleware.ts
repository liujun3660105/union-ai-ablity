export { default } from 'next-auth/middleware';

// export default withAuth({
//   // Matches the pages config in `[...nextauth]`
//   pages: {
//     signIn: '/login',
//   },
// });
// 除了login页面，其他页面都需要进行鉴权
export const config = { matcher: ['/((?!login|register).*)'] };

// export default withAuth({
//     callbacks: {
//       authorized: ({ req, token }) =>
//         req.nextUrl.pathname?.slice(0, 5) === '/api/' ||
//         req.nextUrl.pathname === '/api/health' ||
//         !!token,
//     }
//   });

// export default withAuth({
//   // Matches the pages config in `[...nextauth]`
//   pages: {
//     signIn: '/login',
//     error: '/error',
//   },
// });
