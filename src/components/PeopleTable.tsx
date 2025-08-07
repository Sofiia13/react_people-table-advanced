import React from 'react';
import { Person } from '../types';
import { PersonLink } from './PersonLink';
import { useSearchParams } from 'react-router-dom';

type Props = {
  people: Person[];
  selectedSlug?: string;
};

/* eslint-disable jsx-a11y/control-has-associated-label */
export const PeopleTable: React.FC<Props> = ({ people, selectedSlug }) => {
  const [searchParams] = useSearchParams();

  const query = searchParams.get('query') || '';
  const sex = searchParams.get('sex') || '';
  const centuries = searchParams.getAll('centuries');

  const getCentury = (wasBorn: number) => {
    return Math.floor((wasBorn - 1) / 100) + 1;
  };

  const filteredPeople = people.filter(person => {
    const matchesQuery = [person.name, person.fatherName, person.motherName]
      .filter(Boolean)
      .some(name => name?.toLowerCase().includes(query.toLowerCase()));

    const matchesSex = sex ? person.sex === sex : true;

    const century = getCentury(person.born);

    const matchesCentury =
      centuries.length > 0 ? centuries.includes(String(century)) : true;

    return matchesQuery && matchesSex && matchesCentury;
  });

  return (
    <table
      data-cy="peopleTable"
      className="table is-striped is-hoverable is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Name
              <a href="#/people?sort=name">
                <span className="icon">
                  <i className="fas fa-sort" />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Sex
              <a href="#/people?sort=sex">
                <span className="icon">
                  <i className="fas fa-sort" />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Born
              <a href="#/people?sort=born&amp;order=desc">
                <span className="icon">
                  <i className="fas fa-sort-up" />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Died
              <a href="#/people?sort=died">
                <span className="icon">
                  <i className="fas fa-sort" />
                </span>
              </a>
            </span>
          </th>

          <th>Mother</th>
          <th>Father</th>
        </tr>
      </thead>

      <tbody>
        {filteredPeople.map(person => (
          <tr
            key={person.slug}
            data-cy="person"
            className={
              selectedSlug === person.slug ? 'has-background-warning' : ''
            }
          >
            <td>
              <PersonLink person={person} />
            </td>
            <td>{person.sex}</td>
            <td>{person.born}</td>
            <td>{person.died}</td>
            <td>
              {person.motherName ? (
                person.mother ? (
                  <PersonLink person={person.mother} />
                ) : (
                  person.motherName
                )
              ) : (
                '-'
              )}
            </td>
            <td>
              {person.fatherName ? (
                person.father ? (
                  <PersonLink person={person.father} />
                ) : (
                  person.fatherName
                )
              ) : (
                '-'
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
