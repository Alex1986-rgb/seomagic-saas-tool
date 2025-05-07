import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface ScanResultsProps {
  urls: string[];
  onExport: () => void;
}

const ScanResults: React.FC<ScanResultsProps> = ({ urls, onExport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUrls, setFilteredUrls] = useState(urls);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = urls.filter(url => url.toLowerCase().includes(term.toLowerCase()));
    setFilteredUrls(filtered);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center bg-background border rounded-md mb-4">
        <div className="px-3 text-muted-foreground">
          <Search className="h-4 w-4" />
        </div>
        <input
          className="flex h-10 w-full rounded-md bg-background py-3 text-sm outline-none"
          placeholder="Search URLs..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      
      {filteredUrls.length > 0 ? (
        <ul className="list-none p-0">
          {filteredUrls.map((url, index) => (
            <li key={index} className="py-2 border-b border-border">
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {url}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No URLs found.</p>
      )}
    </div>
  );
};

export default ScanResults;
