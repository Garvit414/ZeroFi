import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import { Formik, Form } from "formik";

import Subnav from "../components/sideNav";

import LoanDetails1 from "../components/Forms/loanDetails1";
import LoanDetails2 from "../components/Forms/loanDetails2";
import LoanDetails3 from "../components/Forms/loanDetails3";
import PersonalDetails from "../components/Forms/personalDetails";
import Review from "../components/Forms/review";
import HomePage from "./homepage";

import ValidationSchema from "../utils/Forms/validationSchema";
import ApplicationFormModel from "../utils/Forms/applicationFormModel";
import FormInitialValues from "../utils/Forms/formInitialValues";

import useStyles from "../css/baForm";

import Wallet from "../components/wallet/walletHelper";
import { sendUserDetails } from "../redux/actions/user";
import { sendLoanDetails } from "../redux/actions/loan";
import { useDispatch } from "react-redux";

const { formId, formField } = ApplicationFormModel;

function renderStepContent(step, setFieldValue) {
  switch (step) {
    case 0:
      return (
        <PersonalDetails formField={formField} setFieldValue={setFieldValue} />
      );
    case 1:
      return <LoanDetails1 formField={formField} />;
    case 2:
      return <LoanDetails2 formField={formField} />;
    case 3:
      return <LoanDetails3 formField={formField} />;
    case 4:
      return <Review formField={formField} />;
    default:
      return <div>Not Found</div>;
  }
}
const steps = [1, 2, 3, 4, 5];
const BorrowerApplication = (props) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const currentValidationSchema = ValidationSchema[activeStep];
  const isLastStep = activeStep === steps.length - 1;
  const dispatch = useDispatch();

  // function sleep(ms) {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }
  async function submitForm(values, actions) {
    console.log("submit 1");
    // await sleep(1000);

    dispatch(sendUserDetails(values));
    sendLoanDetails(values, props.history);
    actions.setSubmitting(false);
    setActiveStep(activeStep + 1);
  }

  function handleSubmit(values, actions) {
    // console.log({ values, actions });
    if (isLastStep) {
      submitForm(values, actions);
    } else {
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  }

  function handleBack() {
    setActiveStep(activeStep - 1);
  }

  return (
    <Grid container className={classes.ba_main}>
      <Grid item xs={3} className={classes.ba_subNav}>
        <Subnav />
      </Grid>
      <Grid item xs={6} className={classes.ba_subMain}>
        <React.Fragment>
          <Typography
            component="h1"
            variant="h4"
            align="left"
            className={classes.textHeader}
          >
            Application
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => {
              return label !== 5 ? (
                <Step
                  key={label}
                  classes={{
                    root: classes.step,
                    completed: classes.completed,
                  }}
                >
                  <StepLabel
                    StepIconProps={{
                      classes: {
                        root: classes.step,
                        completed: classes.completed,
                        active: classes.active,
                        text: classes.text,
                        disabled: classes.disabled,
                      },
                    }}
                  />
                </Step>
              ) : null;
            })}
          </Stepper>

          <React.Fragment>
            {activeStep === steps.length ? (
              <HomePage />
            ) : (
              <Formik
                initialValues={FormInitialValues}
                validationSchema={currentValidationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, setFieldValue, values }) => (
                  <Form id={formId}>
                    {renderStepContent(activeStep, setFieldValue)}
                    <div className={classes.buttons}>
                      {activeStep !== 0 && (
                        <Button onClick={handleBack} className={classes.button}>
                          Back
                        </Button>
                      )}
                      {console.log(values.bio)}
                      <div className={classes.wrapper}>
                        {isLastStep ? (
                          <Wallet
                            name="submit"
                            type="submit"
                            variant="contained"
                            values={values}
                            history={props.history}
                          />
                        ) : (
                          <Button
                            disabled={isSubmitting}
                            type="submit"
                            variant="contained"
                            className={classes.buttonN}
                          >
                            Next{" "}
                          </Button>
                        )}

                        {isSubmitting && (
                          <CircularProgress
                            size={24}
                            className={classes.buttonProgress}
                          />
                        )}
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </React.Fragment>
        </React.Fragment>
      </Grid>
      <Grid item xs={3} className={classes.homepage_success}></Grid>
    </Grid>
  );
};
export default BorrowerApplication;
