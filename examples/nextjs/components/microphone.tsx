import styles from '../styles/microphone.module.css';
import React from 'react';

const recordingFilter =
  'brightness(0) saturate(100%) invert(12%) sepia(85%) saturate(7357%) hue-rotate(358deg) brightness(90%) contrast(111%)';
const defaultFilter =
  'brightness(0) saturate(100%) invert(9%) sepia(0%) saturate(2096%) hue-rotate(257deg) brightness(99%) contrast(96%)';
const hoverFilter =
  'brightness(0) saturate(100%) invert(36%) sepia(0%) saturate(2087%) hue-rotate(147deg) brightness(95%) contrast(92%)';

export default function Microphone(props: {isRecording: boolean}) {
  const [filter, setFilter] = React.useState(defaultFilter);
  React.useEffect(() => {
    setFilter(props.isRecording ? recordingFilter : defaultFilter);
  }, [props.isRecording]);
  return (
    <svg
      id={styles.microphone}
      style={{filter}}
      onMouseEnter={() => {
        if (!props.isRecording) setFilter(hoverFilter);
      }}
      onMouseLeave={() => {
        if (!props.isRecording) setFilter(defaultFilter);
      }}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2a3 3 0 0 0-3 3v7a3 3 0 1 0 6 0V5a3 3 0 0 0-3-3zM5 12a1 1 0 1 1 2 0 5 5 0 0 0 10 0 1 1 0 1 1 2 0 7.001 7.001 0 0 1-6 6.93V21a1 1 0 1 1-2 0v-2.07A7.001 7.001 0 0 1 5 12z"
      />
    </svg>
  );
}
