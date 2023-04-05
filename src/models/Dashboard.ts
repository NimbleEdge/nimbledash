/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to create models for dashboard page.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 31/Mar/2023
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

export interface DataMatrix {
  Id: string;
  Inference: number;
  ModelId: string;
  Success: string;
  Version: string;
  uTime: number;
}

export interface APIData {
  cloud_avg: number;
  cloud_count: number;
  cloud_mets: Array<DataMatrix>;
  edge_avg: number;
  edge_count: number;
  edge_mets: Array<DataMatrix>;
}
