import fetch from 'isomorphic-unfetch';

async function uploadFile(file) {
  const body = new FormData();
  body.append('data', file);

  const response = await fetch(
    'https://api.graph.cool/file/v1/cjgjy05nx0k4q01860p3k1dzl',
    {
      method: 'POST',
      body,
    }
  );

  const data = await response.json();

  return data;
}

export default uploadFile;
