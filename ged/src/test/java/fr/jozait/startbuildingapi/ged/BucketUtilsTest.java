package fr.jozait.startbuildingapi.ged;

import fr.jozait.startbuildingapi.ged.service.BucketUtils;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
public class BucketUtilsTest {
    @Test
    public void givenFileNameWithSpecialCharacters_whenSafeName_thenReturnSafeName() {
        String unsafe = "/(myname[is]what you see.png";
        String safe = "/_myname_is_what_you_see.png";
        String parsed = BucketUtils.safeDirAndFileName(unsafe);
        assertEquals(parsed, safe);
    }
}
