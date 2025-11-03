# EduQuery SG - Singapore School Database System

**INF2003 Database Systems Project**

A comprehensive web application for exploring Singapore schools, subjects, CCAs, programmes, and distinctive programmes with advanced search capabilities, interactive mapping, and data analytics.

![Node.js](https://img.shields.io/badge/Node.js-v14+-339933?style=flat&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=flat&logo=postgresql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=flat&logo=leaflet&logoColor=white)

---

## Project Overview

EduQuery is a full-stack database management system designed to provide comprehensive access to Singapore's educational landscape. The system demonstrates advanced database concepts including relational database design, NoSQL integration, RESTful API architecture, and complex analytical queries.

**Purpose:** To help students, parents, and educators explore and analyze Singapore's schools through an intuitive search interface with powerful filtering and visualization capabilities.

---

## Key Features

### Core Functionality

**CRUD Operations**
- Create new school records with comprehensive validation
- Read and search school information with multiple query types
- Update existing school details with real-time synchronization
- Delete schools with cascade deletion of related data

**Search Capabilities**
- Universal search across all database entities
- Category-specific searches (schools, subjects, CCAs, programmes, distinctives)
- Advanced search with 25+ filterable fields
- Live search suggestions with partial matching
- Real-time result highlighting

**Interactive School Map**
- Singapore-wide school location visualization
- Zone-based filtering (North, South, East, West, Central)
- School search with automatic map positioning
- Geocoded locations using Singapore OneMap API
- Color-coded markers by geographic zone

**Analytics Dashboard**
- Schools by zone with statistical breakdowns
- Subject diversity analysis across institutions
- Above-average performance metrics
- CCA participation rates and trends
- Data completeness scoring
- Zone comparison analysis
- Custom analytical queries with aggregate functions

### Technical Highlights

- **Hybrid Database Architecture**: PostgreSQL for relational data integrity, MongoDB for flexible activity logging
- **Connection Pooling**: Optimized database connections via Supabase Session Pooler
- **Activity Logging**: Comprehensive user action tracking for analytics
- **Responsive Design**: Mobile-first UI following modern UX principles
- **Error Handling**: Graceful degradation with informative error messages
- **Real-time Updates**: Immediate data synchronization across views

---

## Tech Stack

| Layer | Technology | Badge |
|-------|-----------|-------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) |
| **Mapping** | Leaflet.js | ![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=flat&logo=leaflet&logoColor=white) |
| **Backend** | Node.js, Express.js | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white) |
| **Relational DB** | PostgreSQL (Supabase) | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white) |
| **NoSQL DB** | MongoDB Atlas | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) |
| **API** | RESTful with JSON | ![REST](https://img.shields.io/badge/REST-API-009688?style=flat&logo=fastapi&logoColor=white) |
| **Geocoding** | Singapore OneMap API | ![API](https://img.shields.io/badge/OneMap-API-FF6B6B?style=flat&logo=googlemaps&logoColor=white) |
| **Version Control** | Git, GitHub | ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white) |

---

## Database Schema

### Entity-Relationship Model

```
Schools (1) ──< (M) School_Subjects >── (M) Subjects
   │
   ├──< (M) School_CCAs >── (M) CCAs
   │
   ├──< (M) School_Programmes >── (M) Programmes
   │
   └──< (M) School_Distinctives >── (M) Distinctive_Programmes
```

### Core Tables

**Schools** (Main Entity)
- school_id (PK), school_name, address, postal_code, zone_code, mainlevel_code, principal_name

**Junction Tables** (Many-to-Many Relationships)
- School_Subjects, School_CCAs, School_Programmes, School_Distinctives

**Reference Tables**
- Subjects, CCAs, Programmes, Distinctive_Programmes

**Additional Fields** (Extended Schema)
- Contact information (email, fax)
- School classifications (type, nature, session)
- Special programme indicators (autonomous, gifted, IP, SAP)
- Transportation details (bus routes, MRT access)

### MongoDB Collections
- **activity_logs**: User action tracking with timestamps, action types, and metadata

---

## Installation & Setup

### Prerequisites
- Node.js v14 or higher
- Supabase account (PostgreSQL hosting)
- MongoDB Atlas account

### Quick Start

```bash
# 1. Clone repository
git clone <repo-url>
cd INF2003_EduQuery

# 2. Install dependencies
cd backend
npm install

# 3. Configure environment variables
# Create .env file in project root with database credentials

# 4. Initialize database schema
# Execute schema.sql in Supabase SQL Editor

# 5. Start server
node backend/server.js

# 6. Access application
# Open browser: http://localhost:3000
```

### Environment Variables (.env)

Create a `.env` file in the **project root directory**:

```env
# PostgreSQL (Supabase Session Pooler)
PG_HOST=aws-1-ap-southeast-1.pooler.supabase.com
PG_PORT=5432
PG_DATABASE=postgres
PG_USER=postgres.<project-ref>
PG_PASSWORD=<your-password>

# MongoDB Atlas
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net
MONGO_DB=schooldb

# Server
PORT=3000
```

---

## API Endpoints

### CRUD Operations - Schools

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schools?name=<query>` | Search schools by name |
| POST | `/api/schools` | Create new school record |
| PUT | `/api/schools/:id` | Update existing school |
| DELETE | `/api/schools/:id` | Delete school with cascade |

### Query Operations (Read-Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schools/subjects?name=<query>` | Get subjects offered by school |
| GET | `/api/schools/ccas?name=<query>` | Get CCAs offered by school |
| GET | `/api/schools/programmes?name=<query>` | Get MOE programmes by school |
| GET | `/api/schools/distinctives?name=<query>` | Get ALP/LLP programmes |

### Universal Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search/universal?query=<term>` | Search across all categories |
| GET | `/api/search/details/:type/:id` | Get detailed information for item |

### Map Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schools/map?zone=<zone>` | Get schools with coordinates |
| GET | `/api/schools/map-stats` | Get map statistics by zone |

### Analytics Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/schools-by-zone` | School distribution by zone |
| GET | `/api/analytics/schools-subject-count` | Subject diversity metrics |
| GET | `/api/analytics/above-average-subjects` | Schools exceeding average offerings |
| GET | `/api/analytics/cca-participation` | CCA participation analysis |
| GET | `/api/analytics/data-completeness` | Data quality scoring |
| GET | `/api/analytics/zone-comparison` | Comprehensive zone analysis |

### MongoDB Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/logs` | Get recent activity logs |
| GET | `/api/analytics/popular` | Get popular search queries |

---

## Usage

### Basic Search
1. Enter search term in the search bar (supports partial matching)
2. Select search mode from dropdown (Universal or category-specific)
3. Press Enter or click Search button
4. Results display with relevant metadata and actions

### Universal Search
1. Select "Universal (All Categories)" from search mode dropdown
2. Enter any search term related to schools, subjects, CCAs, or programmes
3. View categorized results with counts for each category
4. Click on any result to view detailed information

### Advanced Search
1. Click "Advanced Search" link below search controls
2. Fill in any combination of 25+ available fields
3. Click Search to execute multi-criteria query
4. View filtered results based on specified criteria

### Managing Schools
1. Navigate to "Manage" tab
2. Click "Add New School" button
3. Complete all required fields in the form
4. Submit to create new database entry
5. Use Edit/Delete buttons in search results for modifications

### Interactive Map
1. Navigate to "Map" tab
2. Schools load automatically with zone-color coding
3. Use zone filter chips to show specific regions
4. Search for schools using the map search box
5. Click markers to view school information
6. Schools auto-zoom when selected from search

### Analytics Dashboard
1. Navigate to "Analytics" tab
2. Click refresh icon on individual cards to load data
3. Or click "Load All Analytics" for comprehensive view
4. Review statistical breakdowns and visualizations
5. Analyze trends across zones, programmes, and metrics

---

## Project Structure

```
INF2003_EduQuery/
├── backend/
│   ├── server.js              # Express server & API routes
│   ├── pg-connection.js       # PostgreSQL connection pool
│   ├── mongo-connection.js    # MongoDB connection
│   ├── schema.sql             # Database schema definition
│   ├── analytics-endpoint.js  # Analytics query examples
│   ├── map-endpoint.js        # Map-specific endpoints
│   ├── test.js                # Database connection tests
│   └── package.json           # Dependencies
│
├── frontend/
│   ├── index.html             # Main application interface
│   ├── script.js              # Core client-side logic
│   ├── style.css              # Base styling
│   ├── map.js                 # Map functionality
│   ├── map_style.css          # Map-specific styles
│   ├── analytics.js           # Analytics dashboard logic
│   ├── analytics.css          # Analytics styling
│   ├── advanced_search.js     # Advanced search functionality
│   └── advanced_search.css    # Advanced search styles
│
├── .env                       # Environment variables (root level)
├── .gitignore                 # Git exclusions
└── README.md                  # Project documentation
```

---

## Technical Implementation

### Database Design Decisions

1. **Normalized Schema**: Third Normal Form (3NF) design reduces data redundancy using junction tables for many-to-many relationships
2. **Session Pooler**: Supabase Session Pooler used for IPv4 compatibility and connection optimization
3. **Cascade Deletion**: Foreign key constraints ensure referential integrity when deleting schools
4. **Indexed Columns**: Strategic indexing on frequently queried columns (school_name, zone_code, postal_code)
5. **Activity Logging**: MongoDB selected for flexible schema and high-write performance requirements

### API Design Principles

- **RESTful Architecture**: Standard HTTP methods with semantic endpoint naming
- **JSON Data Exchange**: Consistent content-type and response formatting
- **Error Handling**: Appropriate HTTP status codes (200, 400, 404, 500) with descriptive messages
- **Input Validation**: Server-side validation for all user inputs with constraint checking
- **Query Optimization**: Parameterized queries prevent SQL injection and improve performance

### Frontend Architecture

- **No Framework Dependencies**: Pure JavaScript for lightweight, fast-loading interface
- **Modal-Based CRUD**: Non-disruptive user experience with overlay modals
- **Toast Notifications**: Immediate feedback for all user actions
- **Responsive Grid Layout**: CSS Grid and Flexbox for adaptive design
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with interactivity

### Advanced Query Techniques

- **Aggregate Functions**: COUNT, AVG, MIN, MAX for statistical analysis
- **Common Table Expressions (CTEs)**: Complex queries with readable subquery organization
- **Window Functions**: Advanced analytics with OVER clauses
- **String Aggregation**: STRING_AGG for concatenating related data
- **Conditional Logic**: CASE statements for computed fields and categorization

---

## Complex SQL Queries

The project implements several advanced SQL patterns:

### Zone Statistics with Aggregation
```sql
SELECT zone_code, COUNT(*) as total_schools, 
       COUNT(DISTINCT mainlevel_code) as school_types
FROM Schools
GROUP BY zone_code
ORDER BY total_schools DESC
```

### Schools Above Average (Nested Query)
```sql
WITH subject_counts AS (
  SELECT school_id, COUNT(subject_id) as subject_count
  FROM School_Subjects
  GROUP BY school_id
)
SELECT * FROM subject_counts
WHERE subject_count > (SELECT AVG(subject_count) FROM subject_counts)
```

### Data Completeness Scoring
```sql
SELECT school_name,
  (CASE WHEN COUNT(DISTINCT subject_id) > 0 THEN 25 ELSE 0 END +
   CASE WHEN COUNT(DISTINCT cca_id) > 0 THEN 25 ELSE 0 END +
   CASE WHEN COUNT(DISTINCT programme_id) > 0 THEN 25 ELSE 0 END +
   CASE WHEN COUNT(DISTINCT distinctive_id) > 0 THEN 25 ELSE 0 END) as score
FROM Schools
LEFT JOIN School_Subjects USING (school_id)
LEFT JOIN School_CCAs USING (school_id)
LEFT JOIN School_Programmes USING (school_id)
LEFT JOIN School_Distinctives USING (school_id)
GROUP BY school_id
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `ERR_CONNECTION_REFUSED` | Verify backend server is running with `node server.js` |
| `ENOTFOUND` database error | Use Supabase Session Pooler endpoint instead of direct connection |
| `Invalid credentials` | Check .env file for correct database credentials |
| Modal not opening | Clear browser cache and perform hard refresh (Ctrl+F5) |
| Map not loading | Ensure Leaflet.js CDN is accessible and map view is active |
| Geocoding failures | Check OneMap API availability or use fallback coordinates |

---

## Project Achievements

### Database Requirements
- Relational database design with full normalization (3NF)
- Complex many-to-many relationships using junction tables
- Advanced SQL queries with JOINs, CTEs, and aggregate functions
- NoSQL integration for analytics and flexible data structures

### Application Requirements
- Complete CRUD operations on main entity (Schools)
- RESTful API with proper HTTP methods and status codes
- Comprehensive input validation and error handling
- Modern, responsive user interface with accessibility features
- Activity logging and analytics dashboards

### Technical Excellence
- Connection pooling for optimal database performance
- Environment-based configuration for security
- SQL injection prevention through parameterized queries
- Graceful error handling with user-friendly messages
- Mobile-responsive design with progressive enhancement
- Real-time search with debouncing for performance
- Interactive mapping with geocoding integration

---

## Future Enhancements

- User authentication and role-based access control
- Export functionality (CSV, PDF reports)
- Advanced charting and data visualization
- Email notifications for data changes
- Bulk import/export capabilities
- Advanced filtering with saved search preferences
- Multi-language support
- Offline mode with service workers

---

## References

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [Leaflet.js Documentation](https://leafletjs.com/)
- [Singapore OneMap API](https://www.onemap.gov.sg/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)
- Ministry of Education Singapore - School data sources

---

## License

This project is developed for educational purposes as part of INF2003 Database Systems coursework.

---

**INF2003 Database Systems Project**  
**Institution:** Singapore Institute of Technology  
**Academic Year:** 2024/2025
