export const generateEmployeeId = (role: string): string => {
    const length = 6; 
  const randomSuffix = Math.random()
    .toString(36)
    .substring(2, length + 2);
  let prefix = "EMP"; 

  switch (role.toUpperCase()) {
    case "HR":
        prefix = "HR";
        break;
    case "DIRECTOR":
        prefix = "DIR";
        break;
    case "EMPLOYEE":
        prefix = "EMP";
        break;
    default:
        break;
  }

  return `${prefix}${randomSuffix.toUpperCase()}`;
};

export const EmployeePassword = () => {
  const length = 12; 
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let securePassword = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    securePassword += charset[randomIndex];
  }

  return securePassword;
};

export const generateVerifcationOTP = () => {
  const min = 1000;
  const max = 9999;
  const randomOTP = Math.floor(Math.random() * (max - min + 1)) + min;

  const otpString = randomOTP.toString();

  return otpString;
};


