const InputError = ({error, message} : {error:boolean, message:string}) => {
    return (

        <div className='flex gap-3 place-items-center'>
            <i className={`fa-solid ${error ? 'text-rose-500 fa-xmark' : 'text-emerald-500 fa-check'} text-2xl drop-shadow-lg`}></i>
            <p className={`text-xl font-semibold ${error ? 'text-rose-500' : 'text-emerald-500'} drop-shadow-lg`}>{message}</p>
        </div>

    );
}

export default InputError;