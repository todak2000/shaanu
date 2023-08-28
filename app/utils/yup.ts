import * as Yup from "yup";

const re =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const SignupSchema = Yup.object().shape({
  firstname: Yup.string().required("First Name is required!"),
  lastname: Yup.string().required("Last Name is required!"),
  email: Yup.string()
    .required("Email is required")
    .matches(re, "This email is invalid!"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Phone Number must be digits only")
    .min(10, "Phone Number must be 11 characters")
    .max(11, "Phone Number must be 11 characters!")
    .required("Phone Number is required!"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters!")
    .required("Password is required!"),
});

export const SigninSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .matches(re, "This email is invalid!"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters!")
    .required("Password is required!"),
});

export const ResetSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .matches(re, "This email is invalid!"),
});

export const DonateSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Please enter at least 3 characters!")
    .required("This is required"),
  pickupAddress: Yup.string().when("category", {
    is: (name: string) => name !== "Cash",
    then: () => Yup.string().required("Pickup address is required"),
  }),
});
