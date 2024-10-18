import { localization } from "../../localization";

interface Props {
  error: boolean;
  message: any;
}

export const InputMessage = (props: Props) => {
  const localizeError = (message: any) => {
    const enErrors = localization.en.errors;
    const lvErrors = localization.lv.errors;

    const errorKey = (Object.keys(enErrors) as (keyof typeof enErrors)[]).find(
      (key) => enErrors[key] === message[0]
    );

    if (errorKey && lvErrors[errorKey]) {
      return lvErrors[errorKey];
    }

    return message;
  };

  const localizeSuccess = (message: any) => {
    const enSuccess = localization.en.success;
    const lvSuccess = localization.lv.success;

    const successKey = (
      Object.keys(enSuccess) as (keyof typeof enSuccess)[]
    ).find((key) => enSuccess[key] === message[0]);

    if (successKey && lvSuccess[successKey]) {
      return lvSuccess[successKey];
    }

    return message;
  };

  return (
    <div className="flex gap-2 place-items-center">
      <i
        className={`fa-solid ${
          props.error ? "text-rose-500 fa-xmark" : "text-emerald-500 fa-check"
        } text-2xl drop-shadow-lg`}
      ></i>
      <p
        className={`text-lg font-semibold ${
          props.error ? "text-rose-500" : "text-emerald-500"
        } drop-shadow-lg`}
      >
        {props.error
          ? localizeError(props.message)
          : localizeSuccess(props.message)}
      </p>
    </div>
  );
};
