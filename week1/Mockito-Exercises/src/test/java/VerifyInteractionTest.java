package org.example;

import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.*;

public class VerifyInteractionTest {

    @Test
    void testVerifyMethodCall() {

        ExternalApi mockApi = mock(ExternalApi.class);

        when(mockApi.getData()).thenReturn("Mock Data");

        MyService service = new MyService(mockApi);

        service.fetchData();

        verify(mockApi).getData();

    }

}