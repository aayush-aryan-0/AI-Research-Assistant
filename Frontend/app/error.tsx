"use client"

export default function error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}){
    return(
        <div>
            <p>error {error.message}</p>
        <button onClick={reset}>retry</button>
        </div>
    )
}