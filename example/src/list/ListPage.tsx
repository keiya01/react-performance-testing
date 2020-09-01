import React from 'react';
import { isString } from '../utils/isString';
import { List } from './List';
import { Form } from './Form';

export const ListPage = () => {
  const [list, setList] = React.useState<string[]>([]);
  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;

      /**
       * This is because, FormData not receive argument ...
       */
      // @ts-ignore
      const formData = new FormData(form) as any;

      const message = formData.get('message');
      if (isString(message)) {
        setList((prev) => [message, ...prev]);
      }

      form.reset();
    },
    [],
  );

  return (
    <>
      <Form onSubmit={handleSubmit} />
      <List list={list} />
    </>
  );
};
