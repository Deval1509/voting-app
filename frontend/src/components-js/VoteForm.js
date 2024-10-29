import React, { useState, useEffect } from 'react';
import CandidateCard from './CandidateCard';
import '../components-css/VoteForm.css';

const VOTING_PERIOD_DAYS = 20; // 20 days

const VoteForm = ({ userId }) => {
  const [candidates, setCandidates] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Fetch candidates from localStorage
  const fetchCandidates = () => {
    try {
      const storedCandidates = JSON.parse(localStorage.getItem('candidates')) || [];

      if (storedCandidates.length > 0) {
        setCandidates(storedCandidates);
        setError('');
      } else {
        setError('No candidates available');
        setCandidates([]);
      }
    } catch (err) {
      console.error('Failed to load candidates:', err);
      setError('Failed to fetch candidates');
      setCandidates([]);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Get user's voting record from localStorage
  const getUserVotingRecord = () => {
    const votingRecords = JSON.parse(localStorage.getItem('votingRecords')) || {};
    return votingRecords[userId] || {};
  };

  // Save user's voting record to localStorage
  const saveUserVotingRecord = (votingRecord) => {
    const votingRecords = JSON.parse(localStorage.getItem('votingRecords')) || {};
    votingRecords[userId] = votingRecord;
    localStorage.setItem('votingRecords', JSON.stringify(votingRecords));
  };

  // Check if the user is eligible to vote for a specific candidate
  const canUserVoteForCandidate = (candidateId) => {
    const userRecord = getUserVotingRecord();
    const candidateVoteRecord = userRecord[candidateId] || null;

    // If there's no record of voting for this candidate, user can vote
    if (!candidateVoteRecord) {
      return true;
    }

    // User has voted before, check if 20 days have passed
    const lastVotedDate = new Date(candidateVoteRecord);
    const currentDate = new Date();
    const differenceInTime = currentDate.getTime() - lastVotedDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    // Check if 20 days have passed since the last vote for this candidate
    return differenceInDays >= VOTING_PERIOD_DAYS;
  };

  const handleVote = (candidateId) => {
    if (!canUserVoteForCandidate(candidateId)) {
      setError(`You have already voted for this candidate. You can vote again after ${VOTING_PERIOD_DAYS} days.`);
      return;
    }

    const updatedCandidates = candidates.map(candidate =>
      candidate.id === candidateId
        ? { ...candidate, votes: candidate.votes + 1 }
        : candidate
    );

    setCandidates(updatedCandidates);
    setSuccess('Vote submitted successfully');
    setError('');

    // Update candidates in localStorage
    localStorage.setItem('candidates', JSON.stringify(updatedCandidates));

    // Update the user's voting record for this candidate with the current timestamp
    const currentDate = new Date().toISOString();
    const userVotingRecord = getUserVotingRecord();
    userVotingRecord[candidateId] = currentDate;
    saveUserVotingRecord(userVotingRecord);
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
              onVote={() => handleVote(candidate.id)}
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
