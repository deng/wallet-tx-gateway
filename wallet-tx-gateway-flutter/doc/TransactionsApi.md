# wallet_tx_gateway.api.TransactionsApi

## Load the API package
```dart
import 'package:wallet_tx_gateway/api.dart';
```

All URIs are relative to *https://wallet-tx.bithub.pro*

Method | HTTP request | Description
------------- | ------------- | -------------
[**apiV1TransactionsPost**](TransactionsApi.md#apiv1transactionspost) | **POST** /api/v1/transactions | Fetch wallet transactions


# **apiV1TransactionsPost**
> ApiV1TransactionsPost200Response apiV1TransactionsPost(apiV1TransactionsPostRequest)

Fetch wallet transactions

Fetch transaction history for a wallet address on a specific chain. Returns merged coin and token transfers sorted by timestamp descending.

### Example
```dart
import 'package:wallet_tx_gateway/api.dart';

final api_instance = TransactionsApi();
final apiV1TransactionsPostRequest = ApiV1TransactionsPostRequest(); // ApiV1TransactionsPostRequest | 

try {
    final result = api_instance.apiV1TransactionsPost(apiV1TransactionsPostRequest);
    print(result);
} catch (e) {
    print('Exception when calling TransactionsApi->apiV1TransactionsPost: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apiV1TransactionsPostRequest** | [**ApiV1TransactionsPostRequest**](ApiV1TransactionsPostRequest.md)|  | 

### Return type

[**ApiV1TransactionsPost200Response**](ApiV1TransactionsPost200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

