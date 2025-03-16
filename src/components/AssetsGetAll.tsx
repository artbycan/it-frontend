import React, { useEffect, useState } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import './AssetsGetAll.css';

interface Asset {
  id: number;
  name: string;
  description?: string;
}

const AssetsGetAll: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchAssets = async () => {
      try {
        const config: AxiosRequestConfig = {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          signal: abortController.signal
        };

        const response: AxiosResponse<Asset[]> = await axios.get('/assets/get', config);
        
        if (!abortController.signal.aborted) {
          const assetsData = response.data || [];
          setAssets(assetsData);
          setLoading(false);
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError('Failed to fetch assets');
          setLoading(false);
          console.error('Error fetching assets:', err);
        }
      }
    };

    fetchAssets();

    return () => {
      abortController.abort();
    };
  }, []);

  if (loading) return <div className="loading">Loading assets...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="assets-container">
      <h2>Assets List</h2>
      <div className="assets-grid">
        {assets && assets.length > 0 ? (
          assets.map((asset: Asset) => (
            <div key={asset.id} className="asset-card">
              <h3>{asset.name}</h3>
              {asset.description && <p>{asset.description}</p>}
            </div>
          ))
        ) : (
          <div className="no-assets">No assets found</div>
        )}
      </div>
    </div>
  );
};

export default AssetsGetAll;