# wallet_tx_gateway.api.SystemApi

## Load the API package
```dart
import 'package:wallet_tx_gateway/api.dart';
```

All URIs are relative to *https://wallet-tx.bithub.pro*

Method | HTTP request | Description
------------- | ------------- | -------------
[**healthGet**](SystemApi.md#healthget) | **GET** /health | Health check


# **healthGet**
> HealthGet200Response healthGet()

Health check

### Example
```dart
import 'package:wallet_tx_gateway/api.dart';

final api_instance = SystemApi();

try {
    final result = api_instance.healthGet();
    print(result);
} catch (e) {
    print('Exception when calling SystemApi->healthGet: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**HealthGet200Response**](HealthGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

