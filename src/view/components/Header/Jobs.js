import { CircularProgress, IconButton, Menu, MenuItem, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';

import { JobStatus } from 'consts';
import { useJobs } from 'hooks';
import { CancelIcon, CheckCircleIcon, ErrorIcon, HourglassEmptyIcon, MoreHorizIcon } from 'icons';

import styles from './Jobs.styles';

const useStyles = makeStyles(styles, { name: 'Jobs' });

const JobStatusIcons = {
  [JobStatus.INIT]: HourglassEmptyIcon,
  [JobStatus.CANCEL]: MoreHorizIcon,
  [JobStatus.CANCELLED]: CancelIcon,
  [JobStatus.DONE]: CheckCircleIcon,
  [JobStatus.ERROR]: ErrorIcon,
  [JobStatus.RUN]: CircularProgress,
};

const JobProgress = ({ className, job, ...props }) => {
  const classes = useStyles();

  const { count, total, status } = job;

  const JobStatusIcon = JobStatusIcons[status];
  const progress = status === JobStatus.RUN && total > 0 ? Math.round(100 * (count / total)) : undefined;

  return (
    <JobStatusIcon
      className={clsx(classes.progress, status, className)}
      style={{ width: 20, height: 20 }}
      value={progress}
      variant={progress === undefined ? 'indeterminate' : 'static'}
      {...props}
    />
  );
};

JobProgress.propTypes = {
  className: PropTypes.string,
  job: PropTypes.shape({
    status: PropTypes.string.isRequired, // TODO: from enum
    count: PropTypes.number,
    total: PropTypes.number,
  }).isRequired,
};

JobProgress.defaultProps = {
  className: '',
};

const Jobs = ({ className }) => {
  const classes = useStyles();

  const { jobs, loadJobs, refreshInterval } = useJobs();
  useEffect(() => {
    const timerId = refreshInterval
      ? setInterval(() => loadJobs(), refreshInterval)
      : setTimeout(() => loadJobs(), refreshInterval);

    return () => {
      clearInterval(timerId);
    };
  }, [loadJobs, refreshInterval]);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const onMenuOpenClick = useCallback((event) => setMenuAnchorEl(event.currentTarget), []);

  const onMenuCloseClick = useCallback((/* event */) => setMenuAnchorEl(null), []);

  return (
    <div className={clsx(classes.root, className)}>
      {!jobs && <CircularProgress />}
      {jobs && (
        <>
          <IconButton color="inherit" onClick={onMenuOpenClick}>
            {jobs.length ? <JobProgress job={jobs[0]} /> : <CheckCircleIcon />}
          </IconButton>
          <Menu id="long-menu" anchorEl={menuAnchorEl} keepMounted open={!!menuAnchorEl} onClose={onMenuCloseClick}>
            {!jobs.length && (
              <MenuItem className={classes.menuItem} onClick={onMenuCloseClick}>
                <span className="title">Nincsen folyamatban lévő művelet.</span>
                <CheckCircleIcon className="progress" />
              </MenuItem>
            )}
            {jobs.map((job) => (
              <MenuItem key={job.jobId} className={classes.menuItem} onClick={onMenuCloseClick}>
                <span className="title">{job.title}</span>
                <JobProgress className="progress" job={job} />
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </div>
  );
};

Jobs.propTypes = {
  className: PropTypes.string,
};

Jobs.defaultProps = {
  className: '',
};

export default Jobs;
