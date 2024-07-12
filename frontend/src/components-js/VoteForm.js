import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CandidateCard from './CandidateCard';
import '../components-css/VoteForm.css';

const VoteForm = ({ userId }) => {
  const [candidates, setCandidates] = useState([]);
  const [isFirstDay, setIsFirstDay] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Function to fetch candidates
  const fetchCandidates = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      setCandidates(response.data.users);
      setIsFirstDay(response.data.isFirstDay);
      setError('');
    } catch (err) {
      setError('Failed to fetch candidates');
      setCandidates([]);
      setIsFirstDay(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleVote = async (candidateId) => {
    try {
      const response = await axios.post('http://localhost:5000/vote', {
        voterId: userId,
        candidateId: candidateId,
      });
      setSuccess('Vote submitted successfully');
      setError('');
      fetchCandidates();
    } catch (err) {
      setError(err.response?.data || 'Failed to submit vote');
      setSuccess('');
    }
  };

  return (
    <div className="vote-form">
      <h2>Select a Candidate to Vote</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <div className="candidate-grid">
        {candidates.length > 0 ? (
          candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onVote={handleVote}
              showVotes={isFirstDay}
            />
          ))
        ) : (
          <p>No candidates available</p>
        )}
      </div>
    </div>
  );
};

export default VoteForm;
