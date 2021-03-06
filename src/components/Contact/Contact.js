import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { email } from 'api/ServerlessClient';
import { Button, Input, Textarea } from 'components/Inputs';
import { Spinner } from 'components/Spinner';
import { ContactEmail } from 'validations/schemas';

import styles from './Contact.module.css';

function Contact() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: zodResolver(ContactEmail) });
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const onSubmit = async (body) => {
    try {
      setResponse(null);
      setIsLoading(true);
      const { message } = await email.send({ body });
      setResponse(message);
    } catch (e) {
      console.log('e: ', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2>Let&apos;s chat</h2>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Input
          eventClass="umami--focus--from-input"
          errors={errors.from?.message}
          label="From"
          name="from"
          placeholder="example@mail.com"
          register={register}
        />
        <Input
          eventClass="umami--focus--subject-input"
          errors={errors.subject?.message}
          label="Subject"
          name="subject"
          placeholder="Of the utmost importance"
          register={register}
        />
        <Textarea
          eventClass="umami--focus--text-input"
          errors={errors.text?.message}
          label="Message"
          name="text"
          placeholder="Hello there"
          register={register}
        />
        <div className={styles.submitContainer}>
          {response ? <span className={styles.message}>{response}</span> : null}
          {isLoading ? <Spinner /> : null}
          <Button
            disabled={isLoading}
            eventClass="umami--click--send-email"
            label="Send"
          />
        </div>
      </form>
    </>
  );
}

export { Contact };
