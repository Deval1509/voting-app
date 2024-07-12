import React from 'react';
import '../components-css/CandidateCard.css';
import userIcon from '../logo/usr-icon.png';

const CandidateCard = ({ candidate, onVote, showVotes }) => {
  return (
    <div className="candidate-card" onClick={() => onVote(candidate.id)}>
      <img src={ userIcon } alt="Candidate" className="candidate-icon" />
      <h3 className="candidate-name">{candidate.username}</h3>
      {showVotes && <p className="candidate-votes">Votes: {candidate.votes || 0}</p>}
    </div>
  );
};

export default CandidateCard;
