import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { format, isAfter } from 'date-fns';
import classNames from 'classnames';
import { noop } from 'lodash';
import { MoonLoader } from 'react-spinners';

const DATE_FORMAT = 'MM/dd/yyyy';

const Todo = React.memo(({
  id,
  description,
  isComplete,
  updating,
  dueDate,
  onComplete,
  ...rest
}) => {
  const [checked, toggleChecked] = useState(false);

  const date = new Date(dueDate);

  useEffect(() => {
    toggleChecked(isComplete);
  }, [isComplete]);

  return (
    <li
      className={
        classNames(
          'todo',
          isComplete && 'completed',
          dueDate && isAfter(new Date(), date) && !isComplete && 'overdue',
        )
      }
      {...rest}
    >
      <label className={classNames('todo-description', isComplete && 'line-through')}>
        {updating ? (
          <div className="todo-spinner">
            <MoonLoader size={15} />
          </div>
        ) : (
          <input
            className="todo-select"
            type="checkbox"
            disabled={isComplete}
            checked={checked}
            onChange={e => {
              toggleChecked(e.target.checked);
              onComplete(id);
            }}
          />
        )}
        {description}
      </label>
      {dueDate && (
        <span className="due-date">
          {format(date, DATE_FORMAT)}
        </span>
      )}
    </li>
  );
});

Todo.propTypes = {
  id: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isComplete: PropTypes.bool,
  updating: PropTypes.bool,
  dueDate: PropTypes.string,
  onComplete: PropTypes.func,
};

Todo.defaultProps = {
  isComplete: false,
  updating: false,
  onComplete: noop,
}

export default Todo;