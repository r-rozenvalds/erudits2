export const localization = {
  lv: {
    errors: {
      emailExists: "Lietotājs ar šādu e-pastu jau eksistē.",
      passwordConfirmation: "Ievadītās paroles nesakrīt.",
      emailRequired: "E-pasta lauks ir obligāts.",
      passwordRequired: "Paroles lauks ir obligāts.",
      invalidCredentials: "Nepareizi ievadīts e-pasts vai parole.",
      titleRequired: "Virsraksta lauks ir obligāts.",
      disqualifyAmountRequired: "Diskvalificēto skaita lauks ir obligāts.",
      pointAmountRequired: "Punktu skaita lauks ir obligāts.",
      answerTimeRequired: "Atbildes laika lauks ir obligāts.",
      notAuthorized: "Nepietiekamas tiesības.",
    },
    success: {
      gameCreated: "Spēle veiksmīgi izveidota.",
      roundCreated: "Kārta veiksmīgi izveidota.",
      gameSaved: "Spēle veiksmīgi saglabāta.",
      userCreated: "Lietotājs veiksmīgi piereģistrēts.",
      userLoggedIn: "Ienākšana veiksmīga.",
      roundSaved: "Kārta veiksmīgi saglabāta.",
    },
  },
  en: {
    errors: {
      emailExists: "The email has already been taken.",
      passwordConfirmation: "The password field confirmation does not match.",
      emailRequired: "The email field is required.",
      passwordRequired: "The password field is required.",
      invalidCredentials: "Invalid credentials.",
      titleRequired: "The title field is required.",
      disqualifyAmountRequired: "The disqualify amount field is required.",
      pointAmountRequired: "The points field is required.",
      answerTimeRequired: "The answer time field is required.",
      notAuthorized: "You are not authorized to perform this action.",
    },
    success: {
      gameCreated: "Game successfully created.",
      roundCreated: "Round successfully created.",
      gameSaved: "Game successfully saved.",
      userCreated: "User successfully registered.",
      userLoggedIn: "Login successful.",
      roundSaved: "Round successfully saved.",
    },
  },
};

export const localizeError = (message: any) => {
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

export const localizeSuccess = (message: any) => {
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
