
const CLIENT_ID = '693854487734-42n6ruileat5eanml8gjb9apbbjr1620.apps.googleusercontent.com';
const GA4_PROPERTY_ID = '483124520';

let tokenClient;
let accessToken = null;

window.onload = () => {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    callback: async (tokenResponse) => {
      accessToken = tokenResponse.access_token;
      document.getElementById('stats').style.display = 'block';
      await fetchAnalyticsData();
    },
  });

  tokenClient.requestAccessToken({ prompt: '' });
};

async function fetchAnalyticsData() {
  const headers = { Authorization: `Bearer ${accessToken}` };

  const totalRes = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
    {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        dateRanges: [{ startDate: '2020-01-01', endDate: 'today' }],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            stringFilter: { value: 'page_view' }
          }
        }
      }),
    }
  );
  const totalData = await totalRes.json();
  document.getElementById('totalViews').innerText = totalData.rows?.[0]?.metricValues?.[0]?.value || '0';

  const todayRes = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
    {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        dateRanges: [{ startDate: 'today', endDate: 'today' }],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            stringFilter: { value: 'page_view' }
          }
        }
      }),
    }
  );
  const todayData = await todayRes.json();
  document.getElementById('todayViews').innerText = todayData.rows?.[0]?.metricValues?.[0]?.value || '0';
}

const script = document.createElement('script');
script.src = 'https://accounts.google.com/gsi/client';
document.head.appendChild(script);
