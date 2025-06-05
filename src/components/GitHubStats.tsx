// "use client";

// import { useState, useEffect } from "react";

// interface GitHubStatsProps {
//   username: string;
//   token: string;
// }

// export const GitHubStats: React.FC<GitHubStatsProps> = ({
//   username,
//   token,
// }) => {
//   const [repoCount, setRepoCount] = useState<number | null>(null);
//   const [commitCount, setCommitCount] = useState<number | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const reposResponse = await fetch(
//           `https://api.github.com/users/${username}/repos?per_page=100`,
//           {
//             headers: {
//               Authorization: `token ${token}`,
//             },
//           },
//         );
//         if (!reposResponse.ok) {
//           throw new Error(
//             `Ошибка при получении репозиториев: ${reposResponse.statusText}`,
//           );
//         }
//         const reposData = await reposResponse.json();
//         const totalRepos = reposData.length;

//         let totalCommits = 0;

//         if (totalRepos > 0) {
//           const latestRepo = reposData[0];
//           const commitsResponse = await fetch(
//             `https://api.github.com/repos/${username}/${latestRepo.name}/commits?per_page=1`,
//             {
//               headers: {
//                 Authorization: `token ${token}`,
//               },
//             },
//           );
//           if (!commitsResponse.ok) {
//             throw new Error(
//               `Ошибка при получении коммитов: ${commitsResponse.statusText}`,
//             );
//           }
//           const linkHeader = commitsResponse.headers.get("link");
//           if (linkHeader) {
//             const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
//             if (match) {
//               totalCommits = parseInt(match[1], 10);
//             } else {
//               // Если только одна страница
//               const commitsData = await commitsResponse.json();
//               totalCommits = commitsData.length;
//             }
//           } else {
//             // Если нет пагинации
//             const commitsData = await commitsResponse.json();
//             totalCommits = commitsData.length;
//           }
//         }

//         setRepoCount(totalRepos);
//         setCommitCount(totalCommits);
//       } catch (err) {
//         if (err instanceof Error) {
//           setError(err.message);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [username, token]);

//   if (loading) return <div>Загрузка...</div>;
//   if (error) return <div style={{ color: "red" }}>Ошибка: {error}</div>;

//   return (
//     <div>
//       <h2>GitHub Stats - {username}</h2>
//       <p>Repositories: {repoCount}</p>
//       <p>Commits (in latest repository): {commitCount}</p>
//     </div>
//   );
// };
