function ErrorContainer({ errorMessage }: { errorMessage: string }) {
  return <div className="text-red-400 text-xs my-4">{errorMessage}</div>;
}

export default ErrorContainer;
