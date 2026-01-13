import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Dashboard from "../../pages/Dashboard";
import { BrowserRouter } from "react-router-dom";
import * as DataStoreModule from "../../stores/dataStore";

// Mock useDataStore
vi.mock("../../stores/dataStore", () => ({
  useDataStore: vi.fn(),
}));

describe("Dashboard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders statistics correctly", () => {
    // Setup mock return values
    (DataStoreModule.useDataStore as any).mockReturnValue({
      conferences: [
        { id: "1", date: "2023-12-01" },
        { id: "2", date: "2023-12-02" },
      ],
      locations: [{ id: "l1" }],
      technicians: [{ id: "t1" }, { id: "t2" }, { id: "t3" }],
    });

    render(
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Dashboard />
      </BrowserRouter>
    );

    // Check Stats Cards (using regex to be flexible)
    expect(screen.getByText(/2/i)).toBeInTheDocument(); // Conferences count
    expect(screen.getByText(/1/i)).toBeInTheDocument(); // Locations count
    expect(screen.getByText(/3/i)).toBeInTheDocument(); // Technicians count
  });

  it("renders upcoming conferences", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const dateStr = futureDate.toISOString().split("T")[0];

    (DataStoreModule.useDataStore as any).mockReturnValue({
      conferences: [
        {
          id: "1",
          title: "Future Conf",
          date: dateStr,
          startTime: "10:00",
          endTime: "12:00",
          status: "scheduled",
          locationId: "l1",
        },
      ],
      locations: [{ id: "l1", name: "Room A" }],
      technicians: [],
    });

    render(
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText("Future Conf")).toBeInTheDocument();
    expect(screen.getByText("Room A")).toBeInTheDocument();
    expect(screen.getByText(dateStr)).toBeInTheDocument();
  });
});
