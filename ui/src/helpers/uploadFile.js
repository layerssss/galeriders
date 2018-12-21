async function uploadFile(file) {
  const body = new FormData();
  body.append("data", file);

  const token = window.localStorage.getItem("token");

  const response = await fetch(
    `${process.env.REACT_APP_API_ORIGIN}/api/upload_picture`,
    {
      method: "POST",
      body,
      headers: new Headers({
        authorization: `Bearer ${token}`
      })
    }
  );

  if (!response.ok) throw new Error(`Error: ${response.statusText}`);

  const data = await response.json();

  return data;
}

export default uploadFile;
