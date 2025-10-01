import React, { useState } from 'react';
import { ExternalLink, Calendar, Users, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const PatentCard = ({ patent }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!patent) return null;

  const {
    title = 'N/A',
    abstract = 'N/A',
    publication_number = '',
    date = '',
    inventors = [],
    self_link = ''
  } = patent;

  // Parse inventors if it's a string
  let inventorsList = [];
  if (typeof inventors === 'string') {
    try {
      inventorsList = JSON.parse(inventors.replace(/'/g, '"'));
    } catch {
      inventorsList = [inventors];
    }
  } else if (Array.isArray(inventors)) {
    inventorsList = inventors;
  }

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Truncate abstract
  const truncateText = (text, maxLength = 200) => {
    if (!text || text === 'N/A') return text;
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-5 mb-4 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/10">
      {/* Header with Title and Patent Number */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1 leading-tight">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-blue-400">
            <FileText className="w-4 h-4" />
            <span className="font-mono">{publication_number || 'N/A'}</span>
          </div>
        </div>
        {self_link && (
          <a
            href={self_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200 flex-shrink-0"
          >
            <span className="hidden sm:inline">View</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Metadata Row */}
      <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-400">
        {date && (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(date)}</span>
          </div>
        )}
        {inventorsList.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{inventorsList.length} Inventor{inventorsList.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Abstract */}
      <div className="mb-3">
        <p className="text-gray-300 text-sm leading-relaxed">
          {isExpanded ? abstract : truncateText(abstract)}
        </p>
        {abstract && abstract.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 mt-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            {isExpanded ? (
              <>
                <span>Show less</span>
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Show more</span>
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Inventors List (when expanded) */}
      {isExpanded && inventorsList.length > 0 && (
        <div className="pt-3 border-t border-gray-700/50">
          <p className="text-xs text-gray-400 mb-2 font-semibold">Inventors:</p>
          <div className="flex flex-wrap gap-2">
            {inventorsList.map((inventor, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md"
              >
                {inventor}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatentCard;