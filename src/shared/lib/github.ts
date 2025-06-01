import React, { useEffect, useState } from 'react';

interface Repo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

interface ContributionsData {
  totalContributions: number;
  pinnedRepos: Repo[];
}

const OverviewContributions: React.FC = () => {
  const [data, setData] = useState<ContributionsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const username = 'DNikulshin'
  const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!GITHUB_TOKEN) {
          throw new Error('GitHub token не установлен');
        }

        const currentYear = new Date().getFullYear();
        const contributionsQuery = `
          query {
            user(login: "${username}") {
              contributionsCollection(from: "${currentYear}-01-01T00:00:00Z", to: "${currentYear}-12-31T23:59:59Z") {
                contributionCalendar {
                  totalContributions
                }
              }
            }
          }
        `;

        const contributionsResponse = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GITHUB_TOKEN}`,
          },
          body: JSON.stringify({ query: contributionsQuery }),
        });

        const contributionsResult = await contributionsResponse.json();

        const totalContributions =
          contributionsResult.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions || 0;

        const pinnedReposResponse = await fetch(`https://api.github.com/users/${username}`, {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
          },
        });

        const userData = await pinnedReposResponse.json();

        const pinnedReposQuery = `
          {
            user(login: "${username}") {
              pinnedItems(first: 6, types: REPOSITORY) {
                nodes {
                  ... on Repository {
                    name
                    description
                    html_url
                    stargazers_count
                    forks_count
                    language
                  }
                }
              }
            }
          }
        `;

        const pinnedReposResponseGraphQL = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GITHUB_TOKEN}`,
          },
          body: JSON.stringify({ query: pinnedReposQuery }),
        });

        const pinnedReposResult = await pinnedReposResponseGraphQL.json();

        const pinnedRepos: Repo[] =
          pinnedReposResult.data?.user?.pinnedItems?.nodes || [];

        setData({ totalContributions, pinnedRepos });
      } catch (err) {
        console.error(err);
        setError('Ошибка при получении данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [GITHUB_TOKEN, username])



  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Общий вклад за {new Date().getFullYear()}</h2>
      <p>Количество вкладов: {data?.totalContributions}</p>

      <h3>Закрепленные репозитории</h3>
      <ul>
        {data?.pinnedRepos.length ? (
          data.pinnedRepos.map((repo) => (
            <li key={repo.name} style={{ marginBottom: '10px' }}>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                <strong>{repo.name}</strong>
              </a>
              <p>{repo.description}</p>
              <p>
                ⭐ {repo.stargazers_count} | Forks: {repo.forks_count} | Language: {repo.language}
              </p>
            </li>
          ))
        ) : (
          <p>Нет закрепленных репозиториев</p>
        )}
      </ul>
    </div>
  );
};

export default OverviewContributions;
