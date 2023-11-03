function Error({ error }) {
  return (
    <div className="spinner-wrapper">
      <h1>에러 발생</h1>
      <p>{error.message}</p>
      <p>새로고침 해주세요</p>
    </div>
  );
}

export default Error;
