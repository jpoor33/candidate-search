import { useState, useEffect } from "react";
import { searchGithub, searchGithubUser } from "../api/API";
import { Candidate } from "../interfaces/Candidate.interface";

const CandidateSearch = () => {

  //Creatind the state variables required to store potnetial candidates, candidates, and the candidate index
  const [potential, setPotential] = useState<Candidate[]>([]);
  const [candidate, setCandidate] = useState<Candidate>();
  const [currentIndex, setCurrentIndex] = useState(0);

  //First we want to get all candidates from potential candidated 
  const getCandidates = async () => {

    const potentialCandidate = await searchGithub();
    if (potentialCandidate.length === 0) return;
    setPotential(potentialCandidate);

    const currentCandidate = await searchGithubUser(potentialCandidate[currentIndex]);
    setCandidate(currentCandidate);
  };

  const nextCandidate = () => {
    if (currentIndex === potential.length - 1) {
      console.log("no more candidates left");
    } else {
      setCandidate(potential[currentIndex + 1]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    getCandidates();
  }, []);

  const storeCandidate = () => {
    nextCandidate();
    let storedCandidates: Candidate[] = JSON.parse(localStorage.getItem("candidates") as string) || []

    if (candidate) {
      storedCandidates.push(candidate);
      localStorage.setItem("candidates", JSON.stringify(storedCandidates))
    }
  }
  return (
    <div>
      <h1>Candidate Search</h1>
      <div>
        {currentIndex === potential.length - 1 ? (
          <div>No more candidates</div>
        ) : (
          <div>
            <img width="200px" src={candidate && candidate.avatar_url} />
            <p>{candidate && candidate.login}</p>
            <p>{candidate && candidate.email}</p>
            <p>{candidate && candidate.location}</p>
            <p>{candidate && candidate.company}</p>
            <p>{candidate && candidate.bio}</p>

          </div>
        )}
        <button className="removeButton" onClick={nextCandidate}>-</button>
        <button className="addButton" onClick={storeCandidate}>+</button>
      </div>
    </div>
  );
};

export default CandidateSearch;
