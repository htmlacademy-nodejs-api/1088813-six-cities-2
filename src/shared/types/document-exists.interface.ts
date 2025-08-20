export interface DocumentExists {
  exists(documentId: string): Promise<boolean>;
  userExistsByEmail?(email: string): Promise<boolean>;
}
