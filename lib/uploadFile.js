import fetch from 'isomorphic-unfetch';
import cookie from 'cookie';

function parseCookies() {
  return cookie.parse(document.cookie || '');
}

async function uploadFile(file) {
  const body = new FormData();
  body.append('data', file);

  const { token } = parseCookies();

  const response = await fetch('/api/upload_picture', {
    method: 'POST',
    body,
    headers: new Headers({
      authorization: `Bearer ${token}`,
    }),
  });

  const data = await response.json();

  return data;
}

export default uploadFile;
