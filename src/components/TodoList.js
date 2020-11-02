import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  findIndex,
  map,
  orderBy,
  reduce,
} from 'lodash';
import { isAfter } from 'date-fns';
import classNames from 'classnames';
import { BarLoader } from 'react-spinners';
import Todo from './Todo';

const apiEndpoint = 'https://944ba3c5-94c3-4369-a9e6-a509d65912e2.mock.pstmn.io';
const apiKey = 'PMAK-5ef63db179d23c004de50751-10300736bc550d2a891dc4355aab8d7a5c';

const iteratee = ({ dueDate }) => dueDate ? new Date(dueDate).valueOf() : 0;

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState();

  const handleCompleteTodo = useCallback(async (todoId) => {
    setUpdating(todoId);
    try {
      await fetch(
        `${apiEndpoint}/patch/${todoId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Api-Key': apiKey,
          },
          body: JSON.stringify({ isComplete: true }),
        }
      );
      setTodos((prevTodos) => {
        const nextTodos = [...prevTodos];
        const todoIndex = findIndex(todos, ({ id }) => id === todoId);
        nextTodos.splice(todoIndex, 1, { ...prevTodos[todoIndex], isComplete: true });
        return nextTodos;
      });
    } catch (err) {
      // TODO display error message if update fails
    } finally {
      setUpdating(null);
    }
  }, [todos]);

  const sortedTodos = useMemo(() => {
    const [overdueTodos, completedTodos, activeTodos] = reduce(
      todos,
      (acc, todo) => {
        if (todo.dueDate && !todo.isComplete && isAfter(new Date(), new Date(todo.dueDate))) {
          acc[0].push(todo);
          return acc;
        }
        if (todo.isComplete) {
          acc[1].push(todo);
          return acc;
        }
        acc[2].push(todo);
        return acc;
      },
      [[], [], []]
    );

    return [
      ...orderBy(overdueTodos, iteratee),
      ...orderBy(activeTodos, iteratee, ['desc']),
      ...orderBy(completedTodos, iteratee, ['desc']),
    ];
  }, [todos]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `${apiEndpoint}/get`,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              'X-Api-Key': apiKey,
            },
          }
        );
        setTodos(await response.json());
      } catch (err) {
        // TODO display error message if todos can't be loaded
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className={classNames('contents', loading && 'loading')}>
      <BarLoader
        width={600}
        height={10}
        color={'#1a212b'}
        loading={loading}
      />
      {!loading && (
        <ul className="todos">
          {map(sortedTodos, todo => (
            <Todo
              key={todo.id}
              updating={updating === todo.id}
              onComplete={handleCompleteTodo}
              {...todo}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

TodoList.displayName = 'TodoList';

export default TodoList;