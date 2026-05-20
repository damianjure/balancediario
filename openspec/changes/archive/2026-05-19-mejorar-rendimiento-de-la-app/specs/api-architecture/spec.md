# api-architecture Specification

## Purpose

Defines the architecture and performance constraints for the HTTP backend API, ensuring instances remain stateless and database queries are optimized.

## Requirements

### Requirement: Stateless API Authentication Middleware

The API authentication middleware (`requireSession`) MUST remain completely stateless. It MUST NOT use in-memory caches (like Sets or Maps) to track synchronization state across requests, as this breaks horizontal scaling in Cloud Run.

#### Scenario: User requests a protected endpoint
- GIVEN a valid authenticated session
- WHEN the user accesses any protected endpoint other than `/api/me`
- THEN the middleware authenticates the request without performing background synchronization of invitations
- AND no in-memory state is mutated

### Requirement: Invitation Synchronization Strategy

The system MUST synchronize pending dashboard invitations only at discrete, intentional synchronization points (such as app startup or explicit refresh) rather than on every authenticated request.

#### Scenario: User loads the application
- GIVEN a user with pending dashboard invitations
- WHEN the user's client calls the `/api/me` endpoint during initialization
- THEN the system synchronizes pending invitations before returning the user profile

### Requirement: Optimized Dashboard Member Retrieval

The API endpoint to list dashboard members MUST retrieve member details in a single database query, leveraging native JOIN operations (e.g., `app_users`) to prevent N+1 query patterns or sequential fetch overhead.

#### Scenario: Owner views dashboard members
- GIVEN a dashboard with multiple members
- WHEN the user calls the endpoint to list dashboard members
- THEN the system returns the complete list of members and their user profiles (email) executing only one query to the database
