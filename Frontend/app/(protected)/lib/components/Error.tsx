type ErrorProps={
    error:string
}

export default function Error({error}:ErrorProps){
    
    return(
        <>
        {error && (
          <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}
        </>
    )
}