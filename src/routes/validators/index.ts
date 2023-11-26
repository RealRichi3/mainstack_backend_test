import AuthSchemaValidator from "./auth.schema";
import ProductSchemaValidator from "./product.schema";
import UserSchemaValidator from "./user.schema";

class RouteValidatorSchema {
    static Auth = AuthSchemaValidator
    static Product = ProductSchemaValidator
    static User = UserSchemaValidator
}

export default RouteValidatorSchema