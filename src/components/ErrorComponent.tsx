const ErrorComponent = (props:{error:string}) => {
    return (
          <div className="flex h-[400px] items-center justify-center">
                <div className="bg-danger-light dark:bg-danger/20 text-danger p-4 rounded-md">{props.error}</div>
            </div>
    );
};

export default ErrorComponent;
