//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;


class TransactionsApi {
  TransactionsApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  final ApiClient apiClient;

  /// Fetch wallet transactions
  ///
  /// Fetch transaction history for a wallet address on a specific chain. Returns merged coin and token transfers sorted by timestamp descending.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [ApiV1TransactionsPostRequest] apiV1TransactionsPostRequest (required):
  Future<Response> apiV1TransactionsPostWithHttpInfo(ApiV1TransactionsPostRequest apiV1TransactionsPostRequest,) async {
    // ignore: prefer_const_declarations
    final path = r'/api/v1/transactions';

    // ignore: prefer_final_locals
    Object? postBody = apiV1TransactionsPostRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>['application/json'];


    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
    );
  }

  /// Fetch wallet transactions
  ///
  /// Fetch transaction history for a wallet address on a specific chain. Returns merged coin and token transfers sorted by timestamp descending.
  ///
  /// Parameters:
  ///
  /// * [ApiV1TransactionsPostRequest] apiV1TransactionsPostRequest (required):
  Future<ApiV1TransactionsPost200Response?> apiV1TransactionsPost(ApiV1TransactionsPostRequest apiV1TransactionsPostRequest,) async {
    final response = await apiV1TransactionsPostWithHttpInfo(apiV1TransactionsPostRequest,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'ApiV1TransactionsPost200Response',) as ApiV1TransactionsPost200Response;
    
    }
    return null;
  }
}
