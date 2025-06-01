// import { useState, useEffect } from 'react';

// interface Repository {
//   id: number;
//   name: string;
//   html_url: string;
//   description?: string;
//   stargazers_count: number;
//   forks_count: number;
// }

// interface Commit {
//   sha: string;
//   commit: {
//     message: string;
//     author: {
//       name: string;
//       date: string;
//     };
//   };
//   html_url: string;
// }

// interface GithubData {
//   repositories: Repository[];
//   pinnedRepositories: Repository[];
//   commits: Commit[];
//   loading: boolean;
//   error: string | null;
// }

// const GITHUB_API_URL = 'https://api.github.com';

// export const useGithub = (
//   username: string,
//   pinnedRepoNames: string[] = [] 
// ): GithubData => {
//   const [repositories, setRepositories] = useState<Repository[]>([]);
//   const [pinnedRepositories, setPinnedRepositories] = useState<Repository[]>([]);
//   const [commits, setCommits] = useState<Commit[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const reposResponse = await fetch(`${GITHUB_API_URL}/users/${username}/repos?per_page=100`);
//         if (!reposResponse.ok) throw new Error('Failed to fetch repositories');
//         const reposData: Repository[] = await reposResponse.json();
//         setRepositories(reposData);

//         const pinnedRepos = reposData.filter(repo => pinnedRepoNames.includes(repo.name));
//         setPinnedRepositories(pinnedRepos);

//         const commitsPromises = reposData.map(async (repo) => {
//           const commitsResponse = await fetch(
//             `${GITHUB_API_URL}/repos/${username}/${repo.name}/commits?per_page=5`
//           );
//           if (!commitsResponse.ok) throw new Error(`Failed to fetch commits for ${repo.name}`);
//           const commitsData: Commit[] = await commitsResponse.json();
         
//           return commitsData.map(commit => ({
//             ...commit,
//             html_url: commit.html_url,
//           }));
//         });

//         const commitsArrays = await Promise.all(commitsPromises);
//         const allCommits = commitsArrays.flat();
//         setCommits(allCommits);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Unknown error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [username, pinnedRepoNames]);

//   return {
//     repositories,
//     pinnedRepositories,
//     commits,
//     loading,
//     error,
//   };
// };
