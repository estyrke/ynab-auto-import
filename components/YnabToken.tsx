import { ButtonGroup } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { InputControl, SubmitButton } from 'formik-chakra-ui';

type YnabTokenProps = {
  token: string;
  onChangeToken: (token: string) => void;
};

export const YnabToken = (props: YnabTokenProps) => <Formik
  initialValues={{ ynabToken: props.token }}
  onSubmit={(values, actions) => {
    props.onChangeToken(values.ynabToken);
    actions.setSubmitting(false);
  }}
>
  {() => (
    <Form>
      <InputControl name='ynabToken' label="Personal Access Token" />
      <ButtonGroup><SubmitButton>Submit</SubmitButton></ButtonGroup>
    </Form>
  )}
</Formik>;
