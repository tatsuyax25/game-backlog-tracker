// This is the STATS PAGE - shows fun statistics about your game library
// Like the stats screen in a video game that shows your playtime and achievements

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'; // Recharts is our charting library

// Colors for the pie chart slices
const STATUS_COLORS = {
  Playing: '#22c55e', // green
  Completed: '#a855f7', // purple
  Backlog: '#6b7280', // gray
  Dropped: '#ef4444', // red
  Wishlist: '#eab308', // yellow
};