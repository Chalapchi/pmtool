import { useState } from 'react';
import { RichTextEditor } from '@/components/ui';
import { UserPlus, Upload, Paperclip } from 'lucide-react';

interface ProjectOverviewProps {
  projectId: string;
}

export const ProjectOverview = ({ projectId }: ProjectOverviewProps) => {
  const [description, setDescription] = useState('');
  const [pinDescription, setPinDescription] = useState(false);

  return (
    <div className="p-6 space-y-8 max-w-4xl">
      {/* Project Description */}
      <div>
        <h3 className="text-lg font-semibold text-dark-100 mb-4">Project Description</h3>
        <RichTextEditor
          content={description}
          onChange={setDescription}
          placeholder="Enter a description..."
        />

        {/* Pin checkbox */}
        <label className="flex items-center gap-2 mt-3 text-sm text-dark-300 cursor-pointer">
          <input
            type="checkbox"
            checked={pinDescription}
            onChange={(e) => setPinDescription(e.target.checked)}
            className="w-4 h-4 rounded bg-dark-700 border-dark-500 text-primary focus:ring-primary focus:ring-offset-0"
          />
          <span>Pin this description for added visibility</span>
        </label>
      </div>

      {/* Project Roles */}
      <div>
        <h3 className="text-lg font-semibold text-dark-100 mb-4">Project Roles</h3>
        <button className="flex items-center gap-2 px-4 py-2 rounded bg-dark-700 hover:bg-dark-600 text-dark-200 transition-colors">
          <UserPlus className="w-4 h-4" />
          <span>Add member</span>
        </button>
      </div>

      {/* Files */}
      <div>
        <h3 className="text-lg font-semibold text-dark-100 mb-4">Files</h3>
        <button className="flex items-center gap-2 px-4 py-2 rounded bg-dark-700 hover:bg-dark-600 text-dark-200 transition-colors">
          <Upload className="w-4 h-4" />
          <span>Upload file</span>
        </button>

        {/* Empty state */}
        <div className="mt-4 p-8 border-2 border-dashed border-dark-600 rounded-lg text-center text-dark-400">
          <Paperclip className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">No files uploaded yet</p>
        </div>
      </div>
    </div>
  );
};
