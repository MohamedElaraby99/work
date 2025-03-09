import React from "react";
import PropTypes from "prop-types";

const ExamStatus = ({ startDate, endDate }) => {
  const currentDate = new Date(); // Current date and time
  const start = new Date(startDate); // Start date
  const end = new Date(endDate); // End date

  let status;
  if (currentDate < start) {
    status = "قادم"; // Upcoming
  } else if (currentDate >= start && currentDate <= end) {
    status = "متاح"; // Available
  } else {
    status = "انتهى"; // Finished
  }

  return <span className={`exam-status ${status}`}>{status}</span>;
};

ExamStatus.propTypes = {
  startDate: PropTypes.string.isRequired, // Start date in ISO format
  endDate: PropTypes.string.isRequired, // End date in ISO format
};

export default ExamStatus;
