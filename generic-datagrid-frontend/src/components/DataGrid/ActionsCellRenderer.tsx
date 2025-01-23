import React from 'react';
import { IconButton, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

interface ActionsCellRendererProps {
  data: any;
  onDelete: (id: string) => void;
  viewPath: string;
}

const ActionsCellRenderer: React.FC<ActionsCellRendererProps> = ({ data, onDelete, viewPath }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`${viewPath}/${data._id}`);
  };

  return (
    <Stack direction="row" spacing={1}>
      <IconButton
        size="small"
        onClick={handleView}
        color="primary"
      >
        <VisibilityIcon />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => onDelete(data._id)}
        color="error"
      >
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
};

export default ActionsCellRenderer;