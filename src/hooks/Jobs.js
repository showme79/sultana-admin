import { isEqual } from 'lodash-es';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { JobStatus } from 'consts';
import { ChildrenPropType } from 'consts/prop-types';
import services from 'services';

const REFERSH_INTERVAL_RUN = 1000;
const REFERSH_INTERVAL_IDLE = 60000;

const JobStatusOrder = {
  [JobStatus.RUN]: 1,
  [JobStatus.INIT]: 2,
  [JobStatus.DONE]: 3,
  [JobStatus.CANCEL]: 4,
  [JobStatus.ERROR]: 5,
  [JobStatus.CANCELLED]: 6,
};

const jobStatusSorter = (jobA, jobB) =>
  JobStatusOrder[jobA.status] - JobStatusOrder[jobB.status] || +jobB.createdAt - jobA.createdAt;

const initState = {
  jobs: null,
  refreshInterval: 0,
};

const JobsContext = createContext(initState);

export const JobsProvider = ({ children }) => {
  const [state, setState] = useState(initState);
  const { jobs, refreshInterval } = state;

  const loadJobs = useCallback(
    () =>
      services.getJobs({ detailed: true }).then((response) => {
        const { result } = response?.data || {};
        if (!result) {
          return;
        }

        setState((prevState) => {
          const sortedJobs = result
            .map(({ createdAt, updatedAt, ...job }) => ({
              createdAt: new Date(createdAt),
              updatedAt: new Date(updatedAt),
              ...job,
            }))
            .sort(jobStatusSorter);
          const running = sortedJobs[0] && sortedJobs[0].status === JobStatus.RUN;
          return {
            jobs: sortedJobs,
            refreshInterval:
              running || !isEqual(sortedJobs, prevState.jobs) ? REFERSH_INTERVAL_RUN : REFERSH_INTERVAL_IDLE,
          };
        });
      }),
    [],
  );

  const ctx = useMemo(
    () => ({
      jobs,
      loadJobs,
      refreshInterval,
    }),
    [jobs, loadJobs, refreshInterval],
  );

  return <JobsContext.Provider value={ctx}>{children}</JobsContext.Provider>;
};

JobsProvider.propTypes = {
  children: ChildrenPropType.isRequired,
};

export const useJobs = () => useContext(JobsContext);

export const withJobs = () => (Component) => (innerProps) => {
  const jobs = useJobs();
  return <Component jobs={jobs} {...innerProps} />;
};
